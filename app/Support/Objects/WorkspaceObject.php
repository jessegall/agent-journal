<?php

declare(strict_types=1);

namespace App\Support\Objects;

use App\Attributes\ScriptMember;
use App\Attributes\ScriptObject;
use App\Contracts\Files\WorkspaceReader;
use App\Values\ScriptContext;
use App\Values\WorkspaceFacts;

#[ScriptObject('workspace')]
final class WorkspaceObject
{
    #[ScriptMember(read: 'workspace.status')]
    public bool $available { get => $this->facts()->isAvailable; }

    #[ScriptMember(read: 'workspace.status')]
    public bool $dirty { get => $this->facts()->isDirty; }

    #[ScriptMember(read: 'workspace.status')]
    public bool $clean { get => $this->facts()->isClean; }

    /**
     * The checkout's generation, read by the runner to tell a repaired workspace from an unchanged one; a script
     * cannot name it, since only boolean members are script members.
     */
    public int $generation { get => $this->facts()->generation; }

    public function __construct(
        private readonly WorkspaceReader $workspaces,
        private readonly ScriptContext $context,
    ) {}

    private function facts(): WorkspaceFacts
    {
        return $this->workspaces->read($this->context->actor, $this->context->work, $this->context->read);
    }
}
