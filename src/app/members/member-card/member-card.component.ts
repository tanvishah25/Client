import { Component, computed, inject, Input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
@Input() member: Member;
private presenceService = inject(PresenceService);
// It will check this.member.userName there in List of online users.
//  It will create a signal return true or false value
// includes works exactly as contains if uername is there then isOnline = true
//Below creating computed signal
isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member.userName));
}
