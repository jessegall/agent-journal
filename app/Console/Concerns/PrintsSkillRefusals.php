<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Contracts\CommandRefusal;
use App\Exceptions\ContentMissing;
use App\Exceptions\ContentTooLarge;
use App\Exceptions\MarkdownInvalid;
use App\Exceptions\SkillConditionInvalid;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillKeyInvalid;
use App\Exceptions\SkillMissing;
use App\Exceptions\SkillPreviewRefused;
use App\Exceptions\UserActorRequired;
use Closure;
use Illuminate\Console\Command;

/**
 * Runs a skill console write and prints the safe reason of a refusal instead of a trace.
 *
 * @mixin Command
 */
trait PrintsSkillRefusals
{
    /**
     * @param  Closure(): list<string>  $work  the lines to print when it succeeds
     */
    private function printRefusals(Closure $work): int
    {
        try {
            foreach ($work() as $line) {
                $this->line($line);
            }
        } catch (
            CommandRefusal
            |SkillConditionInvalid
            |SkillDeclarationInvalid
            |SkillKeyInvalid
            |SkillMissing
            |SkillPreviewRefused
            |UserActorRequired
            |MarkdownInvalid
            |ContentMissing
            |ContentTooLarge $refusal
        ) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
