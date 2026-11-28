<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareInstallation;
use App\Settings\Enums\ActionMethod;
use App\Sharing\Data\GatewayConfigurePartData;
use App\Sharing\Data\GatewayRevisionData;
use App\Sharing\Data\RootShareData;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The owner's share gateways as settings rows: Offline while sharing is not running, then one row per revision with its
 * label, target, secrets by name, readiness, endpoint, the shares disabling it would revoke, and Make default and
 * Disable; and the native form that configures a gateway with password fields.
 */
final readonly class GatewaySettingsPageBuilder implements PageBuilder
{
    public function __construct(private ShareGatewayRegistry $gateways) {}

    public function build(Request $visit): GatewaySettingsPageData
    {
        return GatewaySettingsPageData::build()->shown($this->content())->finish();
    }

    private function content(): DeclaredLayoutData
    {
        $revisions = array_map(
            fn (ShareGatewayConfiguration $configuration) => GatewayRevisionData::fromConfiguration(
                $configuration,
                $this->gateways,
            ),
            ShareGatewayConfiguration::findAllRevisions(),
        );

        $parts = [LayoutPartData::build()
            ->asBox()
            ->key('header')
            ->style('header')
            ->children(
                LayoutPartData::build()->asText()->key('title')->value('Share gateways')->style('heading')->finish(),
            )
            ->finish()];

        if (! ShareInstallation::hasLiveRun()) {
            $parts[] = LayoutPartData::build()
                ->asNotice()
                ->key('offline')
                ->style('warning')
                ->title('Offline: start the sharing service.')
                ->finish();
        }

        $parts[] = LayoutPartData::build()
            ->asBox()
            ->key('provider')
            ->style('section')
            ->children(
                LayoutPartData::build()
                ->asText()
                ->key('sees')
                ->value('The gateway provider can see the public address and everything a share shows.')
                ->style('paragraph')
                ->finish(),
                LayoutPartData::build()
                ->asText()
                ->key('inspection')
                ->value('Turning off traffic inspection does not hide the content from the provider.')
                ->style('paragraph')
                ->finish(),
            )
            ->finish();

        $parts[] = $revisions === []
            ? LayoutPartData::build()
                ->asNotice()
                ->key('revisions')
                ->style('empty')
                ->title('No gateway is configured yet.')
                ->finish()
            : LayoutPartData::build()
                ->asBox()
                ->key('revisions')
                ->style('stack')
                ->children(
                    ...array_map(fn (GatewayRevisionData $revision) => $this->rowOf($revision), $revisions),
                )
                ->finish();

        $configure = GatewayConfigurePartData::from(['gatewayKeys' => $this->gateways->keys()]);

        $parts[] = LayoutPartData::build()
            ->asNative()
            ->key('configure')
            ->native(
                LayoutNativeData::build()->component('sharing/GatewayConfigureForm')->props($configure)->finish(),
            )
            ->finish();

        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()->asBox()->key('gateways')->style('stack')->children(...$parts)->finish(),
            )
            ->finish();
    }

    private function rowOf(GatewayRevisionData $revision): LayoutPartData
    {
        $heading = [LayoutPartData::build()
            ->asText()
            ->key('label')
            ->value("{$revision->gatewayKey} version {$revision->version}")
            ->style('heading')
            ->finish()];

        if ($revision->isDefault) {
            $heading[] = LayoutPartData::build()
                ->asBadge()
                ->key('default')
                ->text('Default')
                ->tone('good')
                ->finish();
        }

        if ($revision->isDisabled) {
            $heading[] = LayoutPartData::build()
                ->asBadge()
                ->key('disabled')
                ->text('Disabled')
                ->tone('quiet')
                ->finish();
        }

        $parts = [
            LayoutPartData::build()->asBox()->key('heading')->style('row')->children(...$heading)->finish(),
            LayoutPartData::build()
                ->asText()
                ->key('source')
                ->value(
                    "{$revision->publicOrigin} through {$revision->providerHost}, program {$revision->executableVersion}",
                )
                ->style('muted')
                ->finish(),
        ];

        if ($revision->secretReferences !== []) {
            $parts[] = LayoutPartData::build()
                ->asText()
                ->key('secrets')
                ->value('Secrets: '.implode(', ', $revision->secretReferences))
                ->style('muted')
                ->finish();
        }

        $parts[] = $this->readinessOf($revision);

        if ($revision->isHealthy !== null) {
            $parts[] = LayoutPartData::build()
                ->asText()
                ->key('health')
                ->value($revision->isHealthy ? 'Answering.' : 'Not answering health checks.')
                ->finish();
        }

        $parts[] = $this->dependentsOf($revision);

        if (! $revision->isDisabled) {
            $parts[] = $this->actionsOf($revision);
        }

        return LayoutPartData::build()->asBox()->key($revision->id)->style('card')->children(...$parts)->finish();
    }

    private function readinessOf(GatewayRevisionData $revision): LayoutPartData
    {
        if ($revision->setupProblems !== []) {
            return LayoutPartData::build()
                ->asCollection()
                ->key('needed')
                ->style('list')
                ->rows(
                    array_map(
                        fn (string $problem) => LayoutRowData::build()
                            ->key(md5($problem))
                            ->label($problem)
                            ->finish(),
                        $revision->setupProblems,
                    ),
                )
                ->finish();
        }

        return LayoutPartData::build()
            ->asText()
            ->key('ready')
            ->value($revision->isDisabled ? 'Disabled.' : 'Ready.')
            ->finish();
    }

    private function dependentsOf(GatewayRevisionData $revision): LayoutPartData
    {
        if ($revision->dependentShares === []) {
            return LayoutPartData::build()
                ->asText()
                ->key('dependents')
                ->value('No share uses this gateway.')
                ->style('muted')
                ->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key('dependents')
            ->style('section')
            ->children(
                LayoutPartData::build()
                ->asText()
                ->key('heading')
                ->value('Disabling revokes these shares:')
                ->style('muted')
                ->finish(),
                LayoutPartData::build()
                ->asCollection()
                ->key('shares')
                ->style('list')
                ->rows(
                    array_map(
                        fn (RootShareData $share) => LayoutRowData::build()
                            ->key($share->id)
                            ->label("Share {$share->number}")
                            ->value($share->status->value)
                            ->finish(),
                        $revision->dependentShares,
                    ),
                )
                ->finish(),
            )
            ->finish();
    }

    /**
     * Make default while it is not, and Disable, each a form with its own Idempotency-Key; Disable names the shares it
     * revokes in its question.
     */
    private function actionsOf(GatewayRevisionData $revision): LayoutPartData
    {
        $actions = [];

        if (! $revision->isDefault) {
            $actions[] = LayoutPartData::build()
                ->asForm()
                ->key('make-default')
                ->form(
                    LayoutFormData::build()
                        ->method(ActionMethod::Post)
                        ->href(
                            route('sharing.make-share-gateway-default', ['configuration' => $revision->id], false),
                        )
                        ->isKeyed(true)
                        ->finish(),
                )
                ->style('inline')
                ->children(
                    LayoutPartData::build()
                    ->asAction()
                    ->key('send')
                    ->label('Make default')
                    ->action(LayoutActionData::build()->submits(true)->finish())
                    ->finish(),
                )
                ->finish();
        }

        $revoked = count($revision->dependentShares);

        $question = $revoked === 0
            ? 'Disable this gateway? No share uses it.'
            : "Disable this gateway and revoke the {$revoked} shares that use it?";

        $actions[] = LayoutPartData::build()
            ->asForm()
            ->key('disable')
            ->form(
                LayoutFormData::build()
                    ->method(ActionMethod::Delete)
                    ->href(route('sharing.disable-share-gateway', ['configuration' => $revision->id], false))
                    ->isKeyed(true)
                    ->confirmation($question)
                    ->finish(),
            )
            ->style('inline')
            ->children(
                LayoutPartData::build()
                ->asAction()
                ->key('send')
                ->label('Disable')
                ->action(LayoutActionData::build()->submits(true)->finish())
                ->style('danger')
                ->finish(),
            )
            ->finish();

        return LayoutPartData::build()->asBox()->key('actions')->style('row')->children(...$actions)->finish();
    }
}
