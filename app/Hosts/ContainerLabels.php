<?php

declare(strict_types=1);

namespace App\Hosts;

/**
 * The labels the journal puts on the containers, networks and volumes it has the host make, so it finds those of one
 * session or one account again.
 */
final readonly class ContainerLabels
{
    public const string SESSION = 'journal.session';

    public const string ACCOUNT = 'journal.account';
}
