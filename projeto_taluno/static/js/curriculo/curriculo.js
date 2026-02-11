import { useNavigate } from "react-router-dom";

function BotaoVoltar() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(-1)}>
      ← Voltar
    </button>
  );
}
