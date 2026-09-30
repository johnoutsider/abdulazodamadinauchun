import { dictFor, getLang } from "@/lib/i18n";
import AuthForm from "@/components/AuthForm";
import { login } from "../actions";

export default async function Page() {
  return <AuthForm action={login} t={dictFor(await getLang())} mode="login" />;
}
