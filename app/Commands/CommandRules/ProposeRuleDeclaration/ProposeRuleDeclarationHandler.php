<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ProposeRuleDeclaration;

use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Declarations\RuleDeclarations;
use App\Exceptions\DeclarationInvalid;
use App\Values\ProposalReceipt;

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
