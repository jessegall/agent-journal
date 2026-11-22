<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use App\Attributes\RequiresListener;

/**
 * An event whose write owner admits another domain's listener by its name as text, which is no use of that listener.
 */
#[RequiresListener('Domain\Tasks\Listeners\PushTaskState')]
final readonly class DeclaredListener
{
    public const string USED = 'Domain\Tasks\Models\Task';
}
