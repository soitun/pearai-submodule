import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { greenButtonColor } from "../../components";
import { postToIde } from "../../util/ide";
import { setLocalStorage } from "../../util/localStorage";
import { Div, StyledButton } from "./components";

enum ModelType {
  PearAI,
  Cloud,
  Local,
  Custom // your own models
}

function Onboarding() {
  const [hovered, setHovered] = useState(-1);
  const [selected, setSelected] = useState(-1);

  const navigate = useNavigate();
  const handleNavigate = (selectedModel: ModelType) => {
    switch (selectedModel) {
      case ModelType.PearAI:
        navigate("/modelconfig/pearaiserver");
        break;
      case ModelType.Cloud:
        navigate("/models");
        break;
      case ModelType.Local:
        navigate("/localOnboarding");
        break;
      case ModelType.Custom:
        // Only needed when we switch from the default (local) embeddings provider
        postToIde("index/forceReIndex", undefined);
        // Don't show the tutorial above yet because there's another step to complete at /localOnboarding
        postToIde("showTutorial", undefined);
        navigate("/");
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-2 max-w-96 mt-10 mx-auto">
      <h1 className="text-center">Welcome to PearAI</h1>
      <p className="text-center pb-2">
        Let's find the setup that works best for you
      </p>

      <br></br>
      <Div
        color={"#6db33f"} 
        disabled={false}
        selected={selected === ModelType.PearAI}
        hovered={hovered === ModelType.PearAI}
        onClick={() => {
          setSelected(ModelType.PearAI);
        }}
        onMouseEnter={() => setHovered(ModelType.PearAI)}
        onMouseLeave={() => setHovered(-1)}
      >
        <div className="flex items-center">
          <img src={`${window.vscMediaUrl}/logos/pearai-color.png`} className="mr-1" height="24px"></img>
          <h3>PearAI Server</h3>
        </div>
        <p className="mt-0">
          Use PearAI's hosted services for convenient, fully-managed integration, with the current best-in-market language models.
        </p>
        <p className="mt-0">
          Code is not stored, and only passes through our server to the model provider.
        </p>
      </Div>
      <br></br>
      <Div
        color={"#be841b"}
        disabled={false}
        selected={selected === ModelType.Cloud}
        hovered={hovered === ModelType.Cloud} 
        onClick={() => {
          setSelected(ModelType.Cloud);
        }}
        onMouseEnter={() => setHovered(ModelType.Cloud)}
        onMouseLeave={() => setHovered(-1)}
      >
        <h3>⚙️ Other Models</h3>
        <p>
          Use your own API key for different cloud, local, and other LLM providers (i.e. OpenAI).
        </p>
      </Div>
      {selected === ModelType.Cloud}
      <br></br>
      <br />
      <div className="flex">
        <StyledButton
          blurColor={
            selected === 0
              ? "#be841b"
              : selected === 1
              ? greenButtonColor
              : "#1b84be"
          }
          disabled={selected < 0}
          onClick={() => {
            postToIde("completeOnboarding", {
              mode: ["optimized", "local", "custom"][selected+1] as any,
            });
            setLocalStorage("onboardingComplete", true);
            handleNavigate(selected);
          }}
        >
          Continue
        </StyledButton>
      </div>
    </div>
  );
}

export default Onboarding;
