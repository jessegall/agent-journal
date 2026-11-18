<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands;

use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Contracts\Command;
use Tests\Fixtures\Modules\Cards\Handlers\DrawCardHandler;

/**
 * @implements Command<string>
 */
#[HandledBy(DrawCardHandler::class)]
final readonly class DrawCard implements Command
{
    public function __construct(public string $deck) {}
}
