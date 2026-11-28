<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Recordings\Enums\Wire;
use App\Recordings\Recordings;
use PHPUnit\Framework\Assert;

/**
 * The answers a recorded host gave the journal's orders in one scenario, the first it carried out of each order type,
 * as the host wrote them: a mock host answers with these, never with an answer of its own.
 */
final readonly class RecordedHostAnswers
{
    /**
     * The pattern of an answer's path, with the order it answers.
     */
    private const string ANSWER_PATH = '#^/host/instructions/([^/]+)$#';

    /**
     * @param  array<string, array{status: string, facts: array<string, mixed>}>  $answers  by order type
     */
    private function __construct(private string $scenario, private array $answers) {}

    /**
     * The answers of the scenario a driver exchange folder lies in:
     * resources/recordings/<driver>/<build>/<scenario>/exchanges/<exchange>.
     */
    public static function beside(string $exchangeFolder): self
    {
        $scenarioFolder = dirname($exchangeFolder, 2);
        $driver = basename(dirname($scenarioFolder, 2));
        $scenario = basename($scenarioFolder);
        $types = [];
        $answers = [];

        foreach (app(Recordings::class)->scenario($driver, $scenario)->calls(Wire::Host) as $call) {
            if ($call->status !== null && HostRoute::ClaimInstruction->matchesPath($call->path)) {
                foreach (HostClaimedInstructionsPayload::from($call->body)->instructions as $instruction) {
                    $types[$instruction->id] = $instruction->type;
                }
            }

            if ($call->status !== null || preg_match(self::ANSWER_PATH, $call->path, $answered) !== 1) {
                continue;
            }

            $answer = (array) json_decode($call->body, true);

            if (($answer['status'] ?? '') === 'done' && isset($types[$answered[1]])) {
                $answers[$types[$answered[1]]] ??= ['status' => 'done', 'facts' => (array) ($answer['facts'] ?? [])];
            }
        }

        return new self("{$driver}/{$scenario}", $answers);
    }

    /**
     * The recorded answer to an order of the type; a type the recording never answered fails the test by name.
     *
     * @return array{status: string, facts: array<string, mixed>}
     */
    public function to(HostInstructionType $type): array
    {
        return $this->answers[$type->value]
            ?? Assert::fail("The {$this->scenario} recording holds no answer to a {$type->value} order.");
    }
}
