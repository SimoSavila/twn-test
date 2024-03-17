import { Industry, Prisma, RegulatoryElection } from '@prisma/client';

export const RESIDNET_JOHN_DOE: Prisma.ResidentCreateInput = {
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  permitNumber: 123456,
  industry: Industry.FINANCE_AND_INSURANCE,
  regulatoryElection: RegulatoryElection.USA,
  regulatoryElectionSub: 'placeholder',
  permitNumberQrCode: 'data',
  dateOfBirth: new Date('1990-01-01'),
  countyOfBirth: 'USA',
  email: 'john.doe@mail.com',
  citizenship: 'USA',
  gender: 'MALE',
  address: {
    country: 'USA',
    city: 'New York',
    state: 'NY',
    streetAddress: '5th Avenue',
    zipCode: '10001',
    isVerifiedAddress: true,
  },
  phoneNumber: '1234567890',
  typeOfRegistration: 'RESIDENCY',
  willWorkInPhysicalJurisdiction: true,
  nextSubscriptionPaymentDate: new Date('2025-01-01'),
  profilePicture: 'data',
  status: 'ACTIVE',
};
