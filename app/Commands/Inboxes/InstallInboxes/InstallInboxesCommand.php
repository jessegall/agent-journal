<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\InstallInboxes;

use App\Support\Command;

/**
 * Installs the inboxes Core needs, once; a second run changes nothing.
 *
 * @extends Command<null>
 */
final readonly class InstallInboxesCommand extends Command {}
