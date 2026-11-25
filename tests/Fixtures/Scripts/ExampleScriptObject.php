<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Attributes\Scripts\ScriptMember;
use App\Attributes\Scripts\ScriptObject;
use App\Values\ScriptContext;

#[ScriptObject('example')]
final class ExampleScriptObject
{
    #[ScriptMember(read: 'workspace.status')]
    public bool $isSelected { get => $this->context->trigger === 'selected'; }

    public function __construct(private readonly ScriptContext $context) {}
}
