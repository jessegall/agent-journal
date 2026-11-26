<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ProposeRuleDeclaration;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\CommandRules\Declarations\RuleDeclarations;
use App\CommandRules\Exceptions\DeclarationInvalid;
use App\CommandRules\Values\ProposalReceipt;

final readonly class ProposeRuleDeclarationHandler implements CommandHandler
{
    public function __construct(private RuleDeclarations $declarations, private CommandBus $commands) {}

    /**
     * @throws DeclarationInvalid
     */
    public function handle(ProposeRuleDeclarationCommand $command): ProposalReceipt
    {
        $declared = $this->declarations->readSentFile($command->declarationFile);

        return $this->commands->run(
            new ProposeCommandRuleCommand($command->commandRequestId, $declared->requestId, $declared->proposed),
        );
    }
}
