<?php

declare(strict_types=1);

namespace App\Projects\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A write that needs one project was sent while no single project was chosen, such as from All projects.
 */
final class ProjectNotChosen extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forSelection(): self
    {
        return new self('Choose a project for this');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return 422;
    }
}
