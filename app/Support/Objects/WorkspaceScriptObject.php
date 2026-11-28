<?php

declare(strict_types=1);

namespace App\Support\Objects;

use App\Files\Contracts\WorkspaceReader;
use App\Scripts\Attributes\ScriptMember;
use App\Scripts\Attributes\ScriptObject;
use App\Scripts\Values\ScriptContext;
use App\Values\WorkspaceFacts;

#[ScriptObject('workspace')]
final class WorkspaceScriptObject
{
    #[ScriptMember(read: 'workspace.status', name: 'available')]
    public bool $isAvailable { get => $this->facts()->isAvailable; }

    #[ScriptMember(read: 'workspace.status', name: 'dirty')]
    public bool $isDirty { get => $this->facts()->isDirty; }

    #[ScriptMember(read: 'workspace.status', name: 'clean')]
    public bool $isClean { get => $this->facts()->isClean; }

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
