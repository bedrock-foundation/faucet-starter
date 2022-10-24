import React from 'react';
import { useRecoilState } from 'recoil';
import { ModalConfig } from '../modals/Modal';
import AppState from '../recoil/app.recoil';

type UseModal = {
  push: (config: ModalConfig) => void;
  pop: () => void;
  replace: (config: ModalConfig) => void;
  modals: ModalConfig[];
};

export default function useModal(): UseModal {
  const [modals, setModals] = useRecoilState(AppState.modals);

  const push = React.useCallback(
    (config: ModalConfig) => {
      setModals((modals) => [...modals, config]);
    },
    [setModals],
  );

  const pop = React.useCallback(() => {
    setModals((modals) => {
      const newModals = [...modals];
      newModals.pop();
      return newModals;
    });
  }, [setModals]);

  const replace = React.useCallback(
    (config: ModalConfig) => {
      setModals((modals) => {
        const newModals = [...modals];
        newModals.pop();
        newModals.push(config);
        return newModals;
      });
    },
    [setModals],
  );

  return {
    push,
    pop,
    replace,
    modals,
  };
}
