# Writing a module

A module adds commands, templates, buttons or windows to a journal. Start with the working
[Acme review package](../tests/stories/fixtures/acme_review/), the
[Acme suite package](../tests/stories/fixtures/acme_suite/) and the
[Acme findings package](../tests/stories/fixtures/acme_findings/).
Their [stories](../tests/stories/core/modules/third_party.py) install the packages from folders,
use their commands and viewer routes, and remove the review module.

## Declare a template and a button

A package has an `__init__.py` and a `module.py` with one `Module` subclass.
This is the complete review module's `module.py`:

```python
from core.base.module.module import Module
from core.base.template.template_declaration import TemplateDeclaration
from core.base.viewer.button_declaration import ButtonCondition, ButtonDeclaration

from .audit_plan_handler import AuditPlanHandler
from .audit_plan_subcommand import AuditPlanSubcommand


class AcmeReviewModule(Module):
    name = "acme.review"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.plans", "journal.core.templates", "journal.core.viewer", "journal.suites.coding"]
    handlers = [AuditPlanHandler]
    subcommands = [AuditPlanSubcommand]
    templates = [TemplateDeclaration(title="Security review", targets=tuple(["plan"]), purpose="critique",
                                     brief="Read the plan as an attacker. Name each way in and what closes it.")]
    buttons = [ButtonDeclaration("review.audit", ("dock.plans.waiting", "row.plan"), "Audit", "acme audit {row_id}",
                                 condition=ButtonCondition("state", tuple(["ready"])))]
```

The package also contains [AuditPlan](../tests/stories/fixtures/acme_review/audit_plan.py),
[AuditPlanHandler](../tests/stories/fixtures/acme_review/audit_plan_handler.py) and
[AuditPlanSubcommand](../tests/stories/fixtures/acme_review/audit_plan_subcommand.py).
The command reads the plan and returns its number and title. It stands in for the work your own
command would do. Keep those files beside `module.py` when copying the example.

`templates` registers standard templates. Give each a unique title, targets, purpose and brief.
A target must be a model's CLI name, such as `plan`, or the first word of a registered command.
For example, `worker` is a valid command target. The journal stores the declaring module with the
template. A person's own template stays separate, even when it has the same title.

`buttons` registers data for the viewer. `review.audit` is the button's name, `Audit` its label,
and `acme audit {row_id}` the command it runs. The viewer supplies the row number. The condition
shows it only when the row's state is `ready`. This button uses existing plan slots:
`dock.plans.waiting` on the waiting plan card and `row.plan` in the plan panel.
The owner of a slot must be the declaring module or a listed dependency.

A third-party button comes after the journal's buttons and names its module. It cannot be primary.
Its command must belong to its own allowance: sync refuses a line already allowed by a shipped
window, a shipped button, or another module's button, and refuses person-only administration lines.

## Register an agent type

`agent_types` declares the roles a module supplies. Depend on `journal.core.agents` and give each
type a unique key made of lowercase letters and dashes and a label:

```python
from core.base.agent_type import AgentType
from core.base.module.module import Module


class ClerksModule(Module):
    name = "acme.clerks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    agent_types = [AgentType("clerk", "Clerk", extends="helper")]
```

A type can extend another registered type. A helper with `access=Access.WRITING` must have
`separate_folder=True`. An optional `roster` class implements `AgentRoster.available(environment_id)`
and returns the agents that can hold work. `start_line` names a separate start command when one
is needed; `default_profile` names the profile used when a start names none.

Drivers, driver rules, suite defaults and an `AgentPolicy` must name registered types. Sync
refuses unknown roles, duplicate keys, invalid rosters, missing base types and inheritance loops
before changing the stored registry. Register a role in `agent_types` before using it elsewhere.

## Register a profile

Declare profiles on the module that owns them. Each profile names a registered agent type:

```python
from core.base.module.module import Module
from core.base.profile.agent_profile import AgentProfile


class NotesProfilesModule(Module):
    name = "acme.notes-profiles"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    profiles = [AgentProfile("notes-reader", "Reads and explains notes", "Read the notes and report the findings.",
                             agent_type="helper")]
```

A name uses letters, digits, dashes or underscores. Profiles need a description and instructions.
Sync refuses duplicate names, unknown agent types and writing access above the type's allowance.
An agent type's `default_profile` must name a profile of that same type. Set `independent=True`
when each job needs a fresh review. `model` and `codex_model` select models for the two programs.

`Suite.profiles` and `Suite.profile_types` are no longer declarations. Move profiles to
`Module.profiles` and register their types in `Module.agent_types`; sync names that correction
when a plugin still uses the old fields. The profile CLI keeps its `--type` option.

## Keep a read-only agent inside the journal

A read-only agent may run a journal command that reads, or that writes only its own rows or a new row of its own. A
subcommand that writes any row, changes the project's files, runs a program or changes another agent sets
`outward = True`, and a read-only agent is refused it. A subcommand that sets nothing passes, so set it on every
subcommand of those kinds. A model's built `edit`, `delete` and moves count as outward without being set.

## Join a suite or add one

`parent_suite = "coding"` makes the review module's templates and buttons active in environments
using coding, including suites that require coding. It does not limit its commands: `acme audit`
stays registered for the journal when another suite is selected. A suite names its windows.
Installing a third-party suite does not change an environment's current suite.

The Acme suite adds the findings window and keeps coding's windows. Its `acme_suite.py` is:

```python
from core.base.driver.suite import Suite


class AcmeSuite(Suite):
    name = "acme"
    requires = ["coding"]
    windows = ["findings.findings"]
```

The package's [module.py](../tests/stories/fixtures/acme_suite/module.py) registers this class in
`suites = [AcmeSuite]`. The findings module depends on that package and joins `acme`.
Its complete `module.py` is:

```python
from core.base.module.module import Module
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace


class AcmeFindingsModule(Module):
    name = "acme.findings"
    requires_core = ">=5,<6"
    parent_suite = "acme"
    dependencies = ["acme.suite", "journal.core.plans", "journal.core.viewer"]
    button_slots = ["findings.row"]
    windows = [WindowDeclaration("findings.findings", "Findings", "findings.js", WindowLoading.COMPONENT,
                                 place=WindowPlace.PAGE, icon=WindowIcon.PLAN, reads=["plan list", "plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]
```

## Offer a slot in a window

`button_slots = ["findings.row"]` declares a place your module owns. A button needs a slot;
a declaration does not put it at an arbitrary place on a page. A component window must also draw
that slot with the window kit's `ButtonSlot`, supplying the current row, environment and read-only
state. Merely declaring `findings.row` does not render it. The current findings fixture declares
the slot; its minimal window only displays a title.

The sample's window source is [web/findings.js](../tests/stories/fixtures/acme_findings/web/findings.js).
An installed component package supplies its browser files under `web/dist`; this fixture copies the
plain JavaScript source there inside the temporary package before installation. Build your own
component before installing it. A component's code has its own trust requirements; registering a
button does not grant trust to a component.

## Add a section to an inspector

A section is a part of an inspector that your module adds, without the module that owns the row
knowing. It is a window with the place `WindowPlace.SECTION` and a list of slots, so it has the same
bundle, reads, permission, trust step and failure screen as any window. Each model has one slot,
`inspector.<cli name>`, such as `inspector.plan`, `inspector.task` or `inspector.memory`. The
[Acme plan notes package](../tests/stories/fixtures/acme_plan_notes/) adds a button and a section to
plans with no change in the plans module. Its `module.py` is:

```python
class AcmePlanNotesModule(Module):
    name = "acme.plan_notes"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.plans", "journal.core.viewer", "journal.suites.coding"]
    handlers = [NotePlanHandler]
    subcommands = [NotePlanSubcommand]
    buttons = [ButtonDeclaration("plan_notes.note", tuple(["row.plan"]), "Note it", "plan-notes add {row_id}")]
    windows = [WindowDeclaration("plan_notes.notes", "Notes", "notes.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION,
                                 slots=tuple(["inspector.plan"]), icon=WindowIcon.PLAN, reads=["plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]
```

The section reads the row it is shown for with `useWindow().option("row")` and draws its heading with
the kit's `InspectorPart`, so it looks like the rest of the inspector with no styles of its own. The
sample's source is [web/notes.js](../tests/stories/fixtures/acme_plan_notes/web/notes.js). A section
that has nothing to show draws nothing.

Sync refuses a section with no slot, slots on any other window, an unknown slot, a slot of a module you
do not list in `dependencies`, and a suite that names a section, since no pane offers one. A button
cannot use an inspector slot, and a section cannot use a button slot. The sections of the journal come
first, then the others in the order modules sync, all after the parts the inspector draws itself. A
section has no position field.

| What happens | What the person sees |
|---|---|
| Its module is not trusted | The section says how to trust it and loads nothing; the inspector works |
| A read is not yet allowed | The section asks; after Allow it draws |
| A read it did not declare | The read is refused, and the section shows the refusal it is answered with |
| A read fails | `read` never throws: the section draws the failure from `{ok: false, error}` |
| Its code throws | This window failed, with Retry, in that section only |
| Its module is removed | The section and its button leave an open inspector without a reload |
| Another suite is chosen | A section of a module that joined the old suite is not listed |

A share page draws no section. A trusted section runs in the page with the viewer's rights, which is
why trust is asked: nothing stops one that misbehaves on purpose. Only install code you trust.

Install and trust the sample as you would any component module:

```sh
journal module add tests/stories/fixtures/acme_plan_notes
journal window trust acme.plan_notes --environment main
```

The journal's own review rounds are built this way, in the module `journal.core.plan_reviews`. The
plans module names neither the rounds nor the critique button, and a detector keeps it so.

## Install, use and remove

Run these commands from the checkout root as a person. They use the same package folders and add
order as the fixture; the fixture first copies each folder to a temporary location. Build the
findings component as described above before installing that package.

```sh
journal module add tests/stories/fixtures/acme_review
journal module add tests/stories/fixtures/acme_suite
journal module add tests/stories/fixtures/acme_findings
```

`module add` copies a package into `.journal/modules`, lists it for the journal and syncs the
registry. A refused addition restores the module list and removes the new package copy.
The copied package is the installed one; editing the original folder does not edit that copy.

The stories create a ready plan in environment `main`. They then use:

```sh
journal template list --target plan --purpose critique
journal acme audit 1
journal suite choose acme --environment main
journal module remove acme.review
```

Use your plan number and environment when trying the commands in an existing journal.
The template list includes `Security review` and `Module: acme.review`. Choosing Acme adds its
findings window alongside coding's windows. Removing the review module removes its buttons,
standard templates and saved button allowances. It leaves a person's own templates alone.
Removal refuses a module another installed module depends on, protected shipped modules, and
modules whose data cannot be removed safely. Remove dependants first; read the refusal before
changing or deleting data.

## Read a sync refusal

`journal module sync` checks declarations before storing the registry. For example, two modules
registering the same standard template title produce this message:

```text
the modules cannot be synced: the modules acme.review and acme.other both register the template Security review
```

The prefix identifies a sync refusal. The rest names both modules and the conflicting title.
Choose a unique title at its declaration, then sync again. Several problems are separated by
semicolons. Other messages name the offending module, button, template, target or slot:
check the declaration and its dependencies there. Do not fix a refused declaration by changing a
stored registry row. An unknown template target needs a registered model name or command word;
an unknown slot needs its owner's declaration and dependency.

## What button consent allows

The first press of a third-party button asks the person to allow that module's declared commands
in that environment. Declining runs nothing. After approval the same declared lines do not ask
again; a changed line needs fresh consent. The command's normal guards, lifecycle and environment
checks still apply. Share visitors get no action buttons.

This allowance is consent, not a sandbox. A module's Python runs inside the journal process.
Only install code you trust. A button adds data to the page, so the button itself needs no
component trust step; this does not restrict what the installed Python can do.
