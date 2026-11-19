<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actors\Models\UserPresence;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\CapacityReservation;
use App\Agents\Models\ConversationVisit;
use App\Agents\Models\LaunchBypass;
use App\Agents\Models\LaunchCredential;
use App\Agents\Models\ProgramConversation;
use App\Assignments\Models\ClaimAuthorization;
use App\Bus\Models\CommandReceipt;
use App\Comments\Models\Comment;
use App\Engine\Models\EngineFrameTime;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Links\Models\Link;
use App\Links\Support\LinkTypeRegistry;
use App\Mcp\Models\RetainedPage;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Settings\Models\SettingsRecord;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Models\ShareMember;
use App\Sharing\Models\SharePreview;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Models\SkillRequest;
use App\Skills\Models\SkillRevision;
use Illuminate\Support\ServiceProvider;

/**
 * Loads the core that every domain and module builds on: the migrations and listeners of its agents, hooks and links.
 * The core names no domain; domains and modules plug into it.
 */
final class CoreServiceProvider extends ServiceProvider
{
    private const array AREAS = [
        'Actors',
        'Agents',
        'Assignments',
        'Bus',
        'Comments',
        'Communication',
        'Desks',
        'Engine',
        'Hooks',
        'Links',
        'Mcp',
        'Numbers',
        'Processes',
        'Profiles',
        'Settings',
        'Sharing',
        'Skills',
        'Web',
    ];

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([
            'core.agent' => Agent::class,
            'core.agent-session' => AgentSession::class,
            'core.launch-bypass' => LaunchBypass::class,
            'core.launch-credential' => LaunchCredential::class,
            'core.agent-stack' => AgentStackRow::class,
            'core.hook-call' => HookCall::class,
            'core.link' => Link::class,
            'core.claim-authorization' => ClaimAuthorization::class,
            'core.comment' => Comment::class,
            'core.settings-record' => SettingsRecord::class,
            'core.user-presence' => UserPresence::class,
            'core.engine-frame-time' => EngineFrameTime::class,
            'core.capacity-reservation' => CapacityReservation::class,
            'core.conversation-visit' => ConversationVisit::class,
            'core.program-conversation' => ProgramConversation::class,
            'core.skill-publication' => SkillPublication::class,
            'core.skill-request' => SkillRequest::class,
            Profile::LINK_TYPE => Profile::class,
            ProfileRevision::LINK_TYPE => ProfileRevision::class,
            RetainedPage::LINK_TYPE => RetainedPage::class,
            CommandReceipt::LINK_TYPE => CommandReceipt::class,
            Share::LINK_TYPE => Share::class,
            ShareAudit::LINK_TYPE => ShareAudit::class,
            ShareGatewayConfiguration::LINK_TYPE => ShareGatewayConfiguration::class,
            ShareGatewayEndpoint::LINK_TYPE => ShareGatewayEndpoint::class,
            ShareGatewayOperation::LINK_TYPE => ShareGatewayOperation::class,
            ShareInstallation::LINK_TYPE => ShareInstallation::class,
            ShareMember::LINK_TYPE => ShareMember::class,
            SharePreview::LINK_TYPE => SharePreview::class,
            Skill::LINK_TYPE => Skill::class,
            SkillRevision::LINK_TYPE => SkillRevision::class,
            SkillGeneration::LINK_TYPE => SkillGeneration::class,
        ]);

        foreach (self::AREAS as $area) {
            $this->loadMigrationsFrom(dirname(__DIR__)."/{$area}/Database/Migrations");
        }
    }
}
