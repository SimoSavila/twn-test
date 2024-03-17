import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { CreateIndustryChangeApplicationDto } from '../../resident-register-industry/dtos';

export function MustBeSetIfTrue(validationOptions?: ValidationOptions) {
  return function (object: CreateIndustryChangeApplicationDto, propertyName: string) {
    registerDecorator({
      name: 'mustBeSetIfTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const willWorkInPhysicalJurisdiction = args.object['willWorkInPhysicalJurisdiction'];
          if (willWorkInPhysicalJurisdiction === true) {
            // You can adjust this condition to match the logic you need
            return value !== null && value !== undefined;
          }
          return value === null || value === undefined;
        },
        defaultMessage(args: ValidationArguments) {
          const willWorkInPhysicalJurisdiction = args.object['willWorkInPhysicalJurisdiction'];
          return willWorkInPhysicalJurisdiction
            ? `${args.property} must be set if willWorkInPhysicalJurisdiction is true`
            : `${args.property} must be null if willWorkInPhysicalJurisdiction is false`;
        },
      },
    });
  };
}

export function MustBeSetIfTrueAndIsEnum(enumType: any, validationOptions?: ValidationOptions) {
  return function (object: CreateIndustryChangeApplicationDto, propertyName: string) {
    registerDecorator({
      name: 'mustBeSetIfTrueAndIsEnum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [enumType],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const willWorkInPhysicalJurisdiction = args.object['willWorkInPhysicalJurisdiction'];
          if (willWorkInPhysicalJurisdiction === true) {
            // Validate if the value is set and is in the enum
            return value !== undefined && value !== null && Object.values(enumType).includes(value);
          }
          // If not working in physical jurisdiction, allow null or undefined
          return value === null || value === undefined;
        },
        defaultMessage(args: ValidationArguments) {
          const willWorkInPhysicalJurisdiction = args.object['willWorkInPhysicalJurisdiction'];
          return willWorkInPhysicalJurisdiction
            ? `${args.property} must be set if willWorkInPhysicalJurisdiction is true and be a valid enum value`
            : `${args.property} must be null if willWorkInPhysicalJurisdiction is false`;
        },
      },
    });
  };
}
