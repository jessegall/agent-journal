<?php

declare(strict_types=1);

namespace Tests\Reads\Agents;

use App\Agents\Drivers\DefaultDrivers;
use App\Data\Agents\StartPreviewData;
use App\Data\Agents\StartPreviewInput;
use App\Http\Loaders\Agents\StartPreviewLoader;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The preview of the start the form describes for an agent, read for the owner as its start would resolve it now; an
 * agent that does not exist is unavailable, and the model keeps its bound.
 */
#[TestsRead(StartPreviewLoader::class)]
final class StartPreviewLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_preview_of_the_agents_start_is_its_answer(): void
    {
        $this->journal->owner()->installProfiles()->idleAgent('Writer');

        $answer = $this->read(['agent' => $this->journal->agentCalled('Writer')->id, 'family' => DefaultDrivers::CLAUDE_CODE]);

        $this->assertNotSame([], $answer->toArray());
    }

    public function test_an_agent_that_does_not_exist_is_not_found(): void
    {
        $this->journal->owner();

        $this->expectException(ModelNotFoundException::class);

        $this->read(['agent' => 'no-such-agent']);
    }

    public function test_a_model_past_its_bound_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        StartPreviewInput::validateAndCreate(['agent' => 'agent-1', 'model' => str_repeat('m', 101)]);
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function read(array $input): StartPreviewData
    {
        return $this->app->make(StartPreviewLoader::class)(StartPreviewInput::validateAndCreate($input));
    }
}
