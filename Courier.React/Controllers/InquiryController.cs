using Azure.Core;
using Courier.Domain.Models;
using Courier.Domain.Repository;
using Courier.Domain.Repository.IRepository;
using Courier.Domain.Services.OfferService;
using CourierAPI.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Courier.React.Controllers
{
    [ApiController]
    [Route("api2/[controller]")]
    public class InquiryController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOfferService _offerService;
        IValidator<Inquiry> _validator;

        public InquiryController(IUnitOfWork unitOfWork, IOfferService offerService, IValidator<Inquiry> validator)
        {
            _unitOfWork = unitOfWork;
            _offerService = offerService;
            _validator = validator;
        }

        [Authorize(Policy = "GetAllInquiries")]
        [HttpGet]
        public ActionResult<IEnumerable<Inquiry>> Get()
        {
            var inquiries = _unitOfWork.Inquiry.GetAll();
            return Ok(inquiries);
        }

        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<Inquiry>> Get(string id)
        {
            var inquiries = _unitOfWork.Inquiry.GetAll(i => i.User != null && i.User.Auth0Id == id);
            return Ok(inquiries);
        }

        [HttpPost]
        public ActionResult<OfferResponse> Post(InquiryRequest request)
        {
            var inquiry = request.MakeInquiry();
            var validationResult = _validator.Validate(inquiry);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.ToString());

            if(Client.IsUserLogged)
                inquiry.User = _unitOfWork.User.Get((User u) => u.Id == Client.ActiveUser.Id);

            _unitOfWork.Inquiry.Add(inquiry);

            var offer = _offerService.MakeOfferForInquiry(inquiry,
                _unitOfWork.Company.Get((Company c) => c.Id == Company.OurCompany.Id));
            _unitOfWork.Offer.Add(offer);
            _unitOfWork.Save();

            var offerResponse = new OfferResponse(offer);
            return Ok(offerResponse);
        }

    }
}
