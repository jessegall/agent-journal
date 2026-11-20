<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Scripts\Attributes\ScriptMember;
use App\Scripts\Attributes\ScriptObject;
use App\Scripts\Values\ScriptContext;

#[ScriptObject('invalid')]
final readonly class InvalidScriptObject
{
    public function __construct(
        public ScriptContext $context,
        #[ScriptMember(read: 'workspace.status')]
        public string $status = '',
    ) {}
}
