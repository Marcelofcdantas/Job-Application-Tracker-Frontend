import { getPasswordStrength } from "../utils/passwordStrength";

type Props = {
  password: string;
};

export default function PasswordStrength({ password }: Props) {
  if (!password) return null;
  const strength = getPasswordStrength(password);

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        <div
          className={`password-strength-fill strength-${strength.score}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      <small>Password strength: {strength.label}</small>
    </div>
  );
}