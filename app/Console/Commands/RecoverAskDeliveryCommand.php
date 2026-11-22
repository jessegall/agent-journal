<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\AskAttention;
use Illuminate\Console\Command;

final class RecoverAskDeliveryCommand extends Command
{
    protected $signature = 'asks:recover-delivery';

    protected $description = 'Deliver retained supervisor asks and replies';

    public function handle(AskAttention $attention): int
    {
        $attention->recover();

        return self::SUCCESS;
    }
}
