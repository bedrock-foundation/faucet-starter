import { atom } from 'recoil';
import { ModalConfig } from '../modals/Modal';

enum AppStateKeys {
  Modals = 'modals',
}

const modals = atom<ModalConfig[]>({
  key: AppStateKeys.Modals,
  default: [],
});

const AppState = {
  modals,
};

export default AppState;
