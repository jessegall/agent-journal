<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Values\CommandClassSet;
use App\Values\CommandPatternSet;
use App\Values\ProcessGrants;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The process grants of an access policy as the JSON column holds them.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredProcessGrants extends Data
{
    /**
     * @param  list<string>  $allowed
     * @param  list<string>  $denied
     * @param  list<string>  $ceiling
     * @param  list<list<string>>  $allowedPatterns
     * @param  list<list<string>>  $deniedPatterns
     */
    public function __construct(
        public readonly array $allowed,
        public readonly array $denied,
        public readonly array $ceiling,
        public readonly array $allowedPatterns,
        public readonly array $deniedPatterns,
    ) {}

    public static function fromProcessGrants(ProcessGrants $grants): self
    {
        return self::from([
            'allowed' => $grants->allowed->values(),
            'denied' => $grants->denied->values(),
            'ceiling' => $grants->ceiling->values(),
            'allowed_patterns' => $grants->allowedPatterns->wordLists(),
            'denied_patterns' => $grants->deniedPatterns->wordLists(),
        ]);
    }

    public function toProcessGrants(): ProcessGrants
    {
        return new ProcessGrants(
            CommandClassSet::ofValues($this->allowed),
            CommandClassSet::ofValues($this->denied),
            CommandClassSet::ofValues($this->ceiling),
            CommandPatternSet::ofWordLists($this->allowedPatterns),
            CommandPatternSet::ofWordLists($this->deniedPatterns),
        );
    }
}
