<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Declarations\RuleDeclaration;
use App\Values\RuleExample;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Seeding\TestJournal;

/**
 * A command request the journal holds for an agent's line it does not know, acme verify, and the declaration file
 * that proposes a rule for it.
 */
trait HoldsCommandRequests
{
    /**
     * The id of the request held when the start asks the journal to explain acme verify.
     */
    private function heldRequest(TestJournal $journal, TestStart $start): string
    {
        return (string) $journal->agentCall($start, 'POST', '/agent/processes/explain', ['line' => 'acme verify'])
            ->json('held.0.requestId');
    }

    private function declarationFile(string $requestKey): string
    {
        $proposed = AcmeDeclarations::proposedVerify();
        $declaration = RuleDeclaration::from([
            'request_id' => $requestKey,
            'evidence' => $proposed->evidence,
            'examples' => array_map(fn (RuleExample $example) => $example->toArray(), $proposed->examples),
            'rule' => $proposed->rule->toArray(),
        ]);

        return json_encode(['declarations' => [$declaration->toArray()]], JSON_THROW_ON_ERROR);
    }
}
