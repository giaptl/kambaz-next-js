"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ModulesControls from "./modulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import { BsGripVertical } from "react-icons/bs";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { setModules, editModule, updateModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import * as coursesClient from "../../client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");

  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const dispatch = useDispatch();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const fetchModules = useCallback(async () => {
    if (!cid) return;
    try {
      const data = await coursesClient.findModulesForCourse(cid as string);
      dispatch(setModules(data));
    } catch (e) {
      console.error(e);
    }
  }, [cid, dispatch]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = await coursesClient.createModuleForCourse(
      cid as string,
      {
        name: moduleName,
        course: cid,
      },
    );
    dispatch(setModules([...modules, newModule]));
    setModuleName("");
  };

  const onRemoveModule = async (moduleId: string) => {
    await coursesClient.deleteModule(moduleId);
    dispatch(
      setModules(modules.filter((m: { _id: string }) => m._id !== moduleId)),
    );
  };

  const onUpdateModule = async (module: Record<string, unknown>) => {
    const saved = await coursesClient.updateModule(module);
    dispatch(
      setModules(
        modules.map((m: { _id: string }) =>
          m._id === (saved as { _id: string })._id ? saved : m,
        ),
      ),
    );
  };

  return (
    <div className="wd-modules">
      {currentUser?.role === "FACULTY" && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={() => {
            void onCreateModuleForCourse();
          }}
        />
      )}
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: Record<string, unknown>) => (
          <ListGroupItem
            key={module._id as string}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <span className="flex-grow-1">
                {module.editing !== true && (module.name as string)}
                {module.editing === true && (
                  <FormControl
                    className="w-50 d-inline-block"
                    value={(module.name as string) || ""}
                    onChange={(e) =>
                      dispatch(
                        updateModule({
                          ...module,
                          name: e.target.value,
                        }),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const latest = modules.find(
                          (m: { _id: string }) => m._id === module._id,
                        );
                        if (latest) {
                          void onUpdateModule({ ...latest, editing: false });
                        }
                      }
                    }}
                  />
                )}
              </span>
              {currentUser?.role === "FACULTY" && (
                <ModuleControlButtons
                  moduleId={module._id as string}
                  deleteModule={(moduleId) => {
                    void onRemoveModule(moduleId);
                  }}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
              )}
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
