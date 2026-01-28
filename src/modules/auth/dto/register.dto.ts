import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  @MinLength(8)
  @IsString()
  passwordConfirmation: string;
}
