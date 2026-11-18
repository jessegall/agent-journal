<?php

declare(strict_types=1);

namespace App\Skills\Console\Concerns;

use App\Actors\Exceptions\UserActorRequired;
use App\Contracts\CommandRefusal;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Exceptions\SkillPreviewRefused;
use App\Text\Exceptions\ContentMissing;
use App\Text\Exceptions\ContentTooLarge;
use App\Text\Exceptions\MarkdownInvalid;
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
        } catch (CommandRefusal|SkillConditionInvalid|SkillDeclarationInvalid|SkillKeyInvalid|SkillMissing|SkillPreviewRefused|UserActorRequired|MarkdownInvalid|ContentMissing|ContentTooLarge $refusal) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
