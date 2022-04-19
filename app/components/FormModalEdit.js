import React, { useState } from "react";

import { Form, SubmitButton } from "./forms";
import ModalEdit from "./ModalEdit";

function AppFormModalEdit({
  editable = true,
  children,
  icon,
  onSave,
  placeholder,
  value,
  validationSchema,
  width,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (newValues) => {
    onSave(newValues);
    setModalVisible(false);
  };

  return (
    <>
      <ModalEdit
        editable={editable}
        icon={icon}
        modalVisible={modalVisible}
        placeholder={placeholder}
        setModalVisible={setModalVisible}
        value={value}
        width={width}
      >
        <Form
          initialValues={{}}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {children}
          <SubmitButton title="Save" />
        </Form>
      </ModalEdit>
    </>
  );
}

export default AppFormModalEdit;
