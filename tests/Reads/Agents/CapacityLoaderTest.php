<?php

declare(strict_types=1);

namespace Tests\Reads\Agents;

use App\Agents\Data\CapacityData;
use App\Agents\Data\CapacityInput;
use App\Http\Loaders\Agents\CapacityLoader;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Whether a start of an agent would fit the host, read for the owner: it fits, or names the resource it lacks with the
 * words to say why; an agent that does not exist is unavailable, and a budget keeps its bound.
 */
#[TestsRead(CapacityLoader::class)]
final class CapacityLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    private const string MODE = 'required_container';

    public function test_the_answer_says_whether_it_fits_or_what_it_lacks(): void
    {
        $this->journal->owner()->idleAgent('Writer');

        $answer = $this->read(['agent' => $this->journal->agentCalled('Writer')->id, 'mode' => self::MODE]);

        $expected = $answer->fits ? ['fits'] : ['fits', 'resource', 'explanation', 'remedy'];
        $this->assertSame($expected, array_keys($answer->toArray()));
    }

    public function test_an_agent_that_does_not_exist_is_not_found(): void
    {
        $this->journal->owner();

        $this->expectException(ModelNotFoundException::class);

        $this->read(['agent' => 'no-such-agent', 'mode' => self::MODE]);
    }

    public function test_a_budget_below_one_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        CapacityInput::validateAndCreate(['agent' => 'agent-1', 'mode' => self::MODE, 'cpuCores' => 0]);
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function read(array $input): CapacityData
    {
        return $this->app->make(CapacityLoader::class)(CapacityInput::validateAndCreate($input));
    }
}
