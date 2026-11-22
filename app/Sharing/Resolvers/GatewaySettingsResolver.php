<?php

declare(strict_types=1);

namespace App\Sharing\Resolvers;

use App\Http\Data\Sharing\GatewayConfigurePartData;
use App\Http\Data\Sharing\GatewayRevisionData;
use App\Http\Data\Sharing\RootShareData;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Ui\Contracts\PageResolver;
use App\Ui\Enums\ActionMethod;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;

/**
 * The owner's share gateways as settings rows: Offline while the sharing service is not running, what the provider
 * can see, then one row per settings revision with its label, where it sends, its secrets by name, what it still
 * needs or that it is ready, whether its endpoint answers, the shares disabling it would revoke, and Make default and
 * Disable as keyed forms, Disable asking first; and the form that configures a gateway, native because its secrets
 * are typed into password fields that grow and are never shown again.
 */
final readonly class GatewaySettingsResolver implements PageResolver
{
    public function __construct(private ShareGatewayRegistry $gateways) {}

    public function read(): DeclaredLayoutData
    {
        $revisions = array_map(
            fn (ShareGatewayConfiguration $configuration) => GatewayRevisionData::fromConfiguration(
                $configuration,
                $this->gateways,
            ),
            ShareGatewayConfiguration::allRevisions(),
        );

        $parts = [LayoutPartData::box('header', 'header', LayoutPartData::text('title', 'Share gateways', 'heading'))];

        if (! ShareInstallation::hasLiveRun()) {
            $parts[] = LayoutPartData::notice('offline', 'warning', 'Offline: start the sharing service.');
        }

        $parts[] = LayoutPartData::box(
            'provider',
            'section',
            LayoutPartData::text(
                'sees',
                'The gateway provider can see the public address and everything a share shows.',
                'paragraph',
            ),
            LayoutPartData::text(
                'inspection',
                'Turning off traffic inspection does not hide the content from the provider.',
                'paragraph',
            ),
        );
        $parts[] = $revisions === []
            ? LayoutPartData::notice('revisions', 'empty', 'No gateway is configured yet.')
            : LayoutPartData::box(
                'revisions',
                'stack',
                ...array_map(fn (GatewayRevisionData $revision) => $this->rowOf($revision), $revisions),
            );
        $configure = GatewayConfigurePartData::from(['gatewayKeys' => $this->gateways->keys()]);
        $parts[] = LayoutPartData::native(
            'configure',
            LayoutNativeData::of('sharing/GatewayConfigureForm', $configure),
        );

        return DeclaredLayoutData::of(LayoutPartData::box('gateways', 'stack', ...$parts));
    }

    private function rowOf(GatewayRevisionData $revision): LayoutPartData
    {
        $heading = [LayoutPartData::text('label', "{$revision->gatewayKey} version {$revision->version}", 'heading')];

        if ($revision->isDefault) {
            $heading[] = LayoutPartData::badge('default', 'Default', 'good');
        }

        if ($revision->isDisabled) {
            $heading[] = LayoutPartData::badge('disabled', 'Disabled', 'quiet');
        }

        $parts = [
            LayoutPartData::box('heading', 'row', ...$heading),
            LayoutPartData::text(
                'source',
                "{$revision->publicOrigin} through {$revision->providerHost}, program {$revision->executableVersion}",
                'muted',
            ),
        ];

        if ($revision->secretReferences !== []) {
            $parts[] = LayoutPartData::text('secrets', 'Secrets: '.implode(', ', $revision->secretReferences), 'muted');
        }

        $parts[] = $this->readinessOf($revision);

        if ($revision->isHealthy !== null) {
            $parts[] = LayoutPartData::text(
                'health',
                $revision->isHealthy ? 'Answering.' : 'Not answering health checks.',
            );
        }

        $parts[] = $this->dependentsOf($revision);

        if (! $revision->isDisabled) {
            $parts[] = $this->actionsOf($revision);
        }

        return LayoutPartData::box($revision->id, 'card', ...$parts);
    }

    private function readinessOf(GatewayRevisionData $revision): LayoutPartData
    {
        if ($revision->setupProblems !== []) {
            return LayoutPartData::collection('needed', 'list', array_map(
                fn (string $problem) => new LayoutRowData(md5($problem), $problem),
                $revision->setupProblems,
            ));
        }

        return LayoutPartData::text('ready', $revision->isDisabled ? 'Disabled.' : 'Ready.');
    }

    private function dependentsOf(GatewayRevisionData $revision): LayoutPartData
    {
        if ($revision->dependentShares === []) {
            return LayoutPartData::text('dependents', 'No share uses this gateway.', 'muted');
        }

        return LayoutPartData::box(
            'dependents',
            'section',
            LayoutPartData::text('heading', 'Disabling revokes these shares:', 'muted'),
            LayoutPartData::collection('shares', 'list', array_map(
                fn (RootShareData $share) => new LayoutRowData($share->id, "Share {$share->number}", $share->state->value),
                $revision->dependentShares,
            )),
        );
    }

    /**
     * Make default while it is not, and Disable, each a form with its own Idempotency-Key; Disable names the shares it
     * revokes in its question.
     */
    private function actionsOf(GatewayRevisionData $revision): LayoutPartData
    {
        $actions = [];

        if (! $revision->isDefault) {
            $actions[] = LayoutPartData::form(
                'make-default',
                new LayoutFormData(
                    ActionMethod::Post,
                    route('sharing.make-share-gateway-default', ['configuration' => $revision->id], false),
                    isKeyed: true,
                ),
                'inline',
                LayoutPartData::action('send', 'Make default', LayoutActionData::submitting()),
            );
        }

        $revoked = count($revision->dependentShares);
        $question = $revoked === 0
            ? 'Disable this gateway? No share uses it.'
            : "Disable this gateway and revoke the {$revoked} shares that use it?";
        $actions[] = LayoutPartData::form(
            'disable',
            new LayoutFormData(
                ActionMethod::Delete,
                route('sharing.disable-share-gateway', ['configuration' => $revision->id], false),
                isKeyed: true,
                confirmation: $question,
            ),
            'inline',
            LayoutPartData::action('send', 'Disable', LayoutActionData::submitting(), 'danger'),
        );

        return LayoutPartData::box('actions', 'row', ...$actions);
    }
}
