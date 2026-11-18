<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\CoreApi;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\PublicContracts;
use Tests\Architecture\Support\PublicOwner;
use Tests\Architecture\Support\Violation;
use Tests\Architecture\Support\ViolationType;
use Tests\Fixtures\PublicContracts\Plans\Api\PlanCard;
use Tests\Fixtures\PublicContracts\Plans\Api\PlanData;
use Tests\Fixtures\PublicContracts\Plans\Api\PlanStatus;
use Tests\Fixtures\PublicContracts\Plans\Api\PlanSummary;
use Tests\Fixtures\PublicContracts\Plans\Contracts\PlanReader;
use Tests\Fixtures\PublicContracts\Plans\Models\Plan;
use Tests\Fixtures\PublicContracts\Plans\PlanMissing;
use Tests\Fixtures\PublicContracts\Plans\PlanService;
use Tests\Fixtures\PublicContracts\Tasks\Api\TaskRecord;

final class PublicContractRulesTest extends TestCase
{
    public function test_an_interface_an_enum_and_a_data_value_showing_only_public_types_pass(): void
    {
        $this->assertSame([], $this->violationsOf([PlanReader::class, PlanData::class, PlanStatus::class]));
    }

    public function test_a_private_type_reached_through_an_export_fails_at_the_member_that_shows_it(): void
    {
        $this->assertSame(
            ['PlanCard::__construct() shows Tests\Fixtures\PublicContracts\Plans\TaskRow, private to Plans'],
            $this->violationsOf([PlanCard::class]),
        );
    }

    public function test_another_owners_value_fails_even_when_it_is_exported(): void
    {
        $this->assertSame(
            ['PlanSummary::firstTask() shows Tests\Fixtures\PublicContracts\Tasks\Api\TaskRecord, private to Tasks'],
            $this->violationsOf([PlanSummary::class]),
        );
    }

    public function test_a_model_a_service_and_an_exception_outside_exceptions_cannot_be_exported(): void
    {
        $this->assertSame([
            Plan::class.' is an Eloquent model',
            PlanService::class.' is a class with hidden or changeable state, such as a service',
            PlanMissing::class." is an exception outside its owner's Exceptions folder",
            'Tests\Fixtures\PublicContracts\Plans\Gone is a name that does not exist',
        ], $this->violationsOf([Plan::class, PlanService::class, PlanMissing::class, 'Tests\Fixtures\PublicContracts\Plans\Gone']));
    }

    /**
     * @param  list<string>  $planExports
     * @return list<string>
     */
    private function violationsOf(array $planExports): array
    {
        $owners = [
            PublicOwner::core(CoreApi::exports()),
            new PublicOwner('Plans', 'Tests\Fixtures\PublicContracts\Plans', $planExports),
            new PublicOwner('Tasks', 'Tests\Fixtures\PublicContracts\Tasks', [TaskRecord::class]),
        ];
        $roots = ProjectRoots::fromComposer(dirname(__DIR__, 2).'/composer.json');

        return array_values(array_map(
            fn (Violation $violation) => self::describe($violation),
            array_filter((new PublicContracts($owners, $roots))->violations(), fn (Violation $violation) => $violation->usingDomain === 'Plans'),
        ));
    }

    private static function describe(Violation $violation): string
    {
        return match ($violation->type) {
            ViolationType::PrivateTypeInSignature => "{$violation->detail} shows {$violation->used}, private to {$violation->owner}",
            default => "{$violation->used} is {$violation->detail}",
        };
    }
}
