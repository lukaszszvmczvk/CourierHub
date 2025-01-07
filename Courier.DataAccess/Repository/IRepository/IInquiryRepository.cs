﻿using Courier.Domain.Models;
using Courier.Domain.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Courier.DataAccess.Repository.IRepository
{
    public interface IInquiryRepository : IRepository<Inquiry>
    {
        void Update(Inquiry inquiry);
    }
}
