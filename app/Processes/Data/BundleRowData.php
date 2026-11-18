<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Processes\Values\CommandRule;
use App\Processes\Values\RuleBundle;
use Spatie\LaravelData\Data;

/**
 * One installed module's rule bundle waiting for the owner, with the exact digest an approval binds.
 */
final class BundleRowData extends Data
{
    /**
     * @param  list<string>  $rules  the operations its rules declare
     */
    public function __construct(
        public readonly string $module,
        public readonly string $version,
        public readonly string $digest,
        public readonly array $rules,
    ) {}

    public static function fromBundle(RuleBundle $bundle): self
    {
        $rules = array_map(fn (CommandRule $rule): string => $rule->operation(), $bundle->rules);

        return new self($bundle->module, $bundle->version, $bundle->digest(), $rules);
    }
}
