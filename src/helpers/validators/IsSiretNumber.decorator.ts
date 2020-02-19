  
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsSiretConstraint
    implements ValidatorConstraintInterface {
    public validate(siret: number): boolean {
        return (siret.toString().length === 14);
    }
}

export function IsSiret(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsSiretConstraint
        });
    };
}