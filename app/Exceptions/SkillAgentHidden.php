<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * An agent the actor of this request may not see; its skills are not explained to them.
 */
final class SkillAgentHidden extends RuntimeException implements CodedRefusal
{
    public static function for(): self
    {
        return new self('That agent is not one you may see.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
