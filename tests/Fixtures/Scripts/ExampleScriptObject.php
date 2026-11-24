<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Attributes\ScriptMember;
use App\Attributes\ScriptObject;
use App\Values\ScriptContext;

#[ScriptObject('example')]
final class ExampleScriptObject
{
    #[ScriptMember(read: 'workspace.status')]
    public bool $isSelected { get => $this->context->trigger === 'selected'; }

    public function __construct(private readonly ScriptContext $context) {}
}
