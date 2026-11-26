<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Scripts\Attributes\ScriptMember;
use App\Scripts\Attributes\ScriptObject;
use App\Scripts\Values\ScriptContext;

#[ScriptObject('example')]
final class ExampleScriptObject
{
    #[ScriptMember(read: 'workspace.status', name: 'selected')]
    public bool $isSelected { get => $this->context->trigger === 'selected'; }

    public function __construct(private readonly ScriptContext $context) {}
}
