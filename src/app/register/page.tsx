import { dictFor, getLang } from "@/lib/i18n";
import AuthForm from "@/components/AuthForm";
import { register } from "../actions";

export default async function Page() {
  return <AuthForm action={register} t={dictFor(await getLang())} mode="register" />;
}
