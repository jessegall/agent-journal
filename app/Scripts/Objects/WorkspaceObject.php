<?php

declare(strict_types=1);

namespace App\Scripts\Objects;

use App\Agents\Contracts\WorkspaceReader;
use App\Agents\Values\WorkspaceFacts;
use App\Scripts\Attributes\ScriptMember;
use App\Scripts\Attributes\ScriptObject;
use App\Scripts\Values\ScriptContext;

#[ScriptObject('workspace')]
final class WorkspaceObject
{
    #[ScriptMember(read: 'workspace.status')]
    public bool $available { get => $this->facts()->isAvailable; }

    #[ScriptMember(read: 'workspace.status')]
    public bool $dirty { get => $this->facts()->isDirty; }

    #[ScriptMember(read: 'workspace.status')]
    public bool $clean { get => $this->facts()->isClean; }

    public function __construct(
        private readonly WorkspaceReader $workspaces,
        private readonly ScriptContext $context,
    ) {}

    private function facts(): WorkspaceFacts
    {
        return $this->workspaces->read($this->context->actor, $this->context->work, $this->context->read);
    }
}
