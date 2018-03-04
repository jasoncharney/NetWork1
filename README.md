# **NetWork 1** (_working title_)

# Summary 
This is my ongoing attempt at creating a work for networked JavaScript-enabled web devices, to be employed on a local network for an audiovisual installation/gallery piece.

These series of sketches are set up with one device as "master," acting as the initiator for events, ideally connected to a large sound system and screen, while the other clients are responsive audiovisual satellite devices (may be stationary/installed in the gallery, or viewers' own smartphones/tablets connected to the network).

The work will start as a series of episodic sketches, all of similar aesthetic but with different interactions that expose different relationships both between the master and satellite devices as well as all users: ripples emanating from a single source, or an event being passed from client to client, bouncing around the room...

Ideally the work will exploit the latency or other network features/relationships as features, changing as different numbers of clients connect...

## Current modes in development:
1. **boomTss** - big boom on the master, everyone else kind of sizzles.
2. **gradients** - responsive ambient color gradients passed around.
3. **drumPass** - a beat gets passed around the client devices.

## To Do...
- Clear timeouts/stop triggering sounds when modes change.
- Load assets as needed depending on mode/as a callback so clients don't have to wait so long. Test out if it's better with a dedicated router/local network.
<s>- Perhaps run the master as a separate file? Or, figure out namespaces in socket. Better controlling events...but, the master doesn't always have to run on the same device as the server.
    - Along these lines, create separate file to control events/router.</s>
    - Namespaces/channelized sockets? Allow for subdividing clients into further roles/groups.
- Learn streaming functions...(socket.io.stream)
<s>- Get out of localhost onto a local server so other devices can connect! Not sure how to set up ports etc./static routing.</s>
- Figure out static functions better within the draw function (only visualizations occurring inside draw...)
<s>- Remake so 0th user is always the master (don't need extra designation of master function, etc.)</s>

## Progress log

#### 3/2
-Added shockwave function – using instances to propagate a shockwave of particles from master to clients. Particles continue in direction of propagation (with origin at center)
#### 2/25
- Added control page, as a separate namespace (gets and sends to server)
- Client no longer needs to tap the screen to join (deprecated 'ready' function)
- Gradients functions: oscillator bank or (right now) looping background texture. Press a button to move a filter and make the screen shimmer in white. Right now the oscillators are disconnected but 
- To do: Make different versions of the backing texture and use the oscillators to make dynamic foreground sounds.

#### 2/21
- Figured out connecting multiple devices on a local network
- Changed geometries of drumPass/renamed a bunch of variables
- drumPass sends changes on envelopes
- to do: automatic joining - disable welcome screen?
- made some changes to boomTss...
#### 2/19
- Figured out how to re-index users upon disconnections (everyone moves up in the connected user list)
- Change in mode from the master device is sent to other users