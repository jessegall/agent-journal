<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use App\Core\Bus\Contracts\Command;

/**
 * @implements Command<mixed>
 */
final readonly class NoHandlerItem implements Command {}
