<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Loose;

use App\Support\Command;

/**
 * @extends Command<mixed>
 */
final readonly class MisplacedItem extends Command
{
    public function __construct() {}
}
