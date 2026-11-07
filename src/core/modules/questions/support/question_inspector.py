from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.text_field import TextField
from core.modules.questions.models.question import Question

OPEN = ButtonCondition("state", ("open",))

QUESTION_INSPECTOR = InspectorDeclaration(
    Question,
    reads="question show {row_id}",
    label="Question {id} · {state}",
    title="{title}",
    events=("question.*",),
    actions=(
        ButtonDeclaration("questions.write-answer", (), "Write the answer", "question answer {row_id} --answer={answer}", icon="tick", primary=True, condition=OPEN,
                          fields=(TextField("answer", "Your answer"),)),
        ButtonDeclaration("questions.leave", (), "Leave the question without an answer", "question close {row_id}", icon="stop", condition=OPEN,
                          confirm="Leave this question without an answer? The agent is told it was closed."),
    ),
    components=(InspectorComponent("questions.question-options"),),
)
