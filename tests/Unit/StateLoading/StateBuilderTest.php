<?php

declare(strict_types=1);

namespace Tests\Unit\StateLoading;

use App\Exceptions\StateValuesRefused;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\StateLoading\StateBuilder;
use App\Support\StateLoading\StateValues;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Hooks\StateLoading\KeptValuesState;
use Tests\Fixtures\Web\Types\ShelfState;
use Tests\TestCase;

/**
 * One builder makes every state from its saved values: what a state keeps comes back as it was saved, and what it is
 * given to work with comes from the container and is never saved.
 */
final class StateBuilderTest extends TestCase
{
    private FinishedSubjects $finished;

    protected function setUp(): void
    {
        parent::setUp();

        $this->finished = new FinishedSubjects();
        $this->app->instance(FinishedSubjects::class, $this->finished);
    }

    public function test_a_saved_state_is_built_again_with_every_value_it_kept(): void
    {
        $state = $this->build(['subject' => 'a', 'number' => 3, 'shelf' => 'closed', 'names' => ['x', 'y']]);
        $state->close();

        $built = $this->build(StateValues::of($state));

        $this->assertSame(StateValues::of($state), StateValues::of($built));
        $this->assertSame(ShelfState::Closed, $built->shelf());
        $this->assertTrue($built->isFinished());
    }

    public function test_a_collaborator_is_given_by_the_container_and_never_saved(): void
    {
        $state = $this->build(['subject' => 'a', 'number' => 3, 'shelf' => 'open', 'names' => []]);

        $this->assertSame($this->finished, $state->finished());
        $this->assertEqualsCanonicalizing(
            ['subject', 'number', 'shelf', 'names', 'isOpen', 'counted'],
            array_keys(StateValues::of($state)),
        );
    }

    public function test_a_missing_value_is_refused_by_its_type_and_name(): void
    {
        $this->expectExceptionObject(StateValuesRefused::missing('test.kept', 1, 'number'));

        $this->build(['subject' => 'a', 'shelf' => 'open', 'names' => []]);
    }

    public function test_a_value_of_the_wrong_type_is_refused(): void
    {
        $this->expectException(StateValuesRefused::class);

        $this->build(['subject' => 'a', 'number' => 3, 'shelf' => 'lost', 'names' => []]);
    }

    /**
     * @param  array<string, mixed>  $values
     */
    private function build(array $values): KeptValuesState
    {
        $state = $this->app->make(StateBuilder::class)->build(
            RegisteredStateType::named('test.kept', KeptValuesState::class),
            $values,
        );
        $this->assertInstanceOf(KeptValuesState::class, $state);

        return $state;
    }
}
