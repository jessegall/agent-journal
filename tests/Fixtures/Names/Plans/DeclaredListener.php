<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use App\Attributes\RequiresTransactionListener;

/**
 * An event whose write owner admits another domain's listener by its name as text, which is no use of that listener.
 */
#[RequiresTransactionListener('Domain\Tasks\Listeners\PushTaskState')]
final readonly class DeclaredListener
{
    public const string USED = 'Domain\Tasks\Models\Task';
}
