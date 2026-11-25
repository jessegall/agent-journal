<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Attributes\Scripts\ScriptMember;
use App\Attributes\Scripts\ScriptObject;
use App\Values\ScriptContext;

#[ScriptObject('invalid')]
final readonly class InvalidScriptObject
{
    public function __construct(
        public ScriptContext $context,
        #[ScriptMember(read: 'workspace.status', name: 'status')]
        public string $status = '',
    ) {}
}
