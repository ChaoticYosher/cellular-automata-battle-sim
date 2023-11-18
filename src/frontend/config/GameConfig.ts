import { AutomataViewConfig } from "../components/automata/AutomataViewConfig";
import { UIViewConfig } from "../components/ui/UIViewConfig";

export interface GameConfig {
  automataConfig: AutomataViewConfig;
  uiConfig: UIViewConfig;
}
