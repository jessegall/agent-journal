<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Enums\CommandType;
use App\Processes\Enums\OutputRequirement;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A command rule as a proposal or an approved revision stores it, the shape CommandRule::toArray writes; the
 * program, arguments and classes stay in the shapes their own values read.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StoredCommandRule extends Data
{
    /**
     * @param  array<string, mixed>  $program
     * @param  list<string>  $subcommands
     * @param  array<string, mixed>  $arguments
     * @param  list<string>  $classes
     * @param  list<StoredRuleReference>  $replaces
     * @param  list<StoredVerificationContract>  $contracts
     */
    public function __construct(
        public readonly string $id,
        public readonly StoredRuleScope $scope,
        public readonly array $program,
        public readonly array $subcommands,
        public readonly array $arguments,
        public readonly array $classes,
        public readonly CommandType $purpose,
        public readonly OutputRequirement $outputRequirement,
        public readonly StoredExecutableBinding $binding,
        public readonly int $revision,
        #[DataCollectionOf(StoredRuleReference::class)]
        public readonly array $replaces,
        #[DataCollectionOf(StoredVerificationContract::class)]
        public readonly array $contracts,
    ) {}
}
