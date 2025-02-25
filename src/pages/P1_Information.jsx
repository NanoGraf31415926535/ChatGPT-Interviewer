// Imports
import Container from "bmt-template-components-container";
import Title from "bmt-template-components-title";
import Text from "bmt-template-components-text";
import Button from "bmt-template-components-button";
import { useTranslation } from "react-i18next";

// Component
const InformationPage = () => {
  // Access translation
  const { t } = useTranslation();

  return (
    <Container>
      {/* Title */}
      <Title size="h2">{t("information_title")}</Title>

      {/* Project Description */}
      <Text>{t("project_description")}</Text>

      {/* Usage Instructions */}
      <Title size="h2">{t("usage_instructions_title")}</Title>
      <Text>{t("usage_instructions")}</Text>

      {/* Next Button */}
      <Button>{t("next_button_text")}</Button>
    </Container>
  );
};

// Export
export default InformationPage;